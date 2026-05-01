import { Router, Response } from 'express';
import { authenticate, AuthRequest, requireAdmin } from '../middleware/auth';
import prisma from '../prismaClient';

const router = Router();

router.use(authenticate);

// Get all projects for a user
router.get('/', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const projects = await prisma.project.findMany({
      where: {
        OR: [
          { members: { some: { userId: req.user!.id } } },
          req.user!.role === 'Admin' ? {} : { id: 'impossible' }
        ]
      },
      include: { members: { include: { user: { select: { id: true, name: true, role: true } } } } }
    });
    // Admins can see all projects
    if (req.user!.role === 'Admin') {
      const allProjects = await prisma.project.findMany({
        include: { members: { include: { user: { select: { id: true, name: true, role: true } } } } }
      });
      res.json(allProjects);
      return;
    }
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Create project (Admin only)
router.post('/', requireAdmin, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, description } = req.body;
    const project = await prisma.project.create({
      data: { name, description }
    });
    // Add admin as a member automatically
    await prisma.projectMember.create({
      data: { projectId: project.id, userId: req.user!.id }
    });
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Add member to project (Admin only)
router.post('/:projectId/members', requireAdmin, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const projectId = req.params.projectId as string;
    const { email } = req.body;
    
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) { res.status(404).json({ error: 'User not found' }); return; }

    const member = await prisma.projectMember.create({
      data: { projectId, userId: user.id }
    });
    res.json(member);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;

import { Router, Response } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import prisma from '../prismaClient';

const router = Router();
router.use(authenticate);

// Get all tasks (Admins see all, Members see assigned or project tasks)
router.get('/', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (req.user!.role === 'Admin') {
      const tasks = await prisma.task.findMany({ include: { assignedTo: { select: { id: true, name: true } }, project: true } });
      res.json(tasks);
      return;
    }

    const tasks = await prisma.task.findMany({
      where: {
        OR: [
          { assignedToId: req.user!.id },
          { project: { members: { some: { userId: req.user!.id } } } }
        ]
      },
      include: { assignedTo: { select: { id: true, name: true } }, project: true }
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Create Task
router.post('/', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, description, projectId, assignedToId, dueDate } = req.body;
    // Basic check if user is admin or belongs to project
    const task = await prisma.task.create({
      data: { title, description, projectId, assignedToId, dueDate: dueDate ? new Date(dueDate) : null }
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update Task status
router.patch('/:id/status', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const { status } = req.body; // "TODO", "IN_PROGRESS", "DONE"
    const task = await prisma.task.update({
      where: { id },
      data: { status }
    });
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;

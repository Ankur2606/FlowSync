import { NextRequest, NextResponse } from 'next/server';

// In a production app, this would be stored in a database
let tasks: any[] = [];

export async function GET(request: NextRequest) {
  try {
    // Simple query parameter handling for filtering
    const searchParams = request.nextUrl.searchParams;
    const sourceId = searchParams.get('sourceId');
    const completed = searchParams.get('completed');
    
    let filteredTasks = [...tasks];
    
    if (sourceId) {
      filteredTasks = filteredTasks.filter(task => task.source.id === sourceId);
    }
    
    if (completed !== null) {
      const isCompleted = completed === 'true';
      filteredTasks = filteredTasks.filter(task => task.completed === isCompleted);
    }
    
    return NextResponse.json({ tasks: filteredTasks });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate task input
    if (!body.title || !body.priority || !body.source) {
      return NextResponse.json(
        { error: 'Missing required task fields' },
        { status: 400 }
      );
    }
    
    // Create new task with unique ID
    const newTask = {
      id: `task_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      title: body.title,
      description: body.description,
      dueDate: body.dueDate ? new Date(body.dueDate) : undefined,
      priority: body.priority,
      source: body.source,
      tags: body.tags || [],
      completed: body.completed || false,
      createdAt: new Date(),
    };
    
    tasks.push(newTask);
    
    return NextResponse.json({ task: newTask }, { status: 201 });
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!body.id) {
      return NextResponse.json(
        { error: 'Task ID is required' },
        { status: 400 }
      );
    }
    
    const taskIndex = tasks.findIndex(task => task.id === body.id);
    
    if (taskIndex === -1) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }
    
    // Update only the provided fields
    const updatedTask = {
      ...tasks[taskIndex],
      ...body,
      updatedAt: new Date(),
    };
    
    tasks[taskIndex] = updatedTask;
    
    return NextResponse.json({ task: updatedTask });
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json(
      { error: 'Failed to update task' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Task ID is required' },
        { status: 400 }
      );
    }
    
    const taskIndex = tasks.findIndex(task => task.id === id);
    
    if (taskIndex === -1) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }
    
    // Remove the task
    const deletedTask = tasks[taskIndex];
    tasks.splice(taskIndex, 1);
    
    return NextResponse.json({ task: deletedTask });
  } catch (error) {
    console.error('Error deleting task:', error);
    return NextResponse.json(
      { error: 'Failed to delete task' },
      { status: 500 }
    );
  }
}
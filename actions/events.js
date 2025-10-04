'use server'

import { db } from "@/lib/prisma";
import { eventSchema } from "@/lib/validators";
import { auth } from "@clerk/nextjs/server"

export const createEvent = async (data) => {
    const { userId } = await auth();
    console.log('user')
    if (!userId) {
        throw new Error('Unauthorized')
    }
    const validatedData = eventSchema.parse(data)
    const user = await db.user.findUnique({
        where: { clerkUserId: userId },
    });
    if (!user) {
        throw new Error('User not found')
    }
    const event = await db.event.create({
        data: {
            ...validatedData,
            userId: user.id
        }

    })
    return event;
}

export const getUserEvents = async () => {
    const { userId } = await auth()
    if (!userId) {
        throw new Error('Unauthorized')
    }
    const user = await db.user.findUnique({
        where: { clerkUserId: userId },
    });

    const events = await db.event.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        include: {
            _count: {
                select: { bookings: true },
            },
        },
    });

    return { events, username: user.username };
}

export async function deleteEvent(eventId) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const event = await db.event.findUnique({
    where: { id: eventId },
  });

  if (!event || event.userId !== user.id) {
    throw new Error("Event not found or unauthorized");
  }

  await db.event.delete({
    where: { id: eventId },
  });

  return { success: true };
}

export async function getEventDetails(username, eventId) {
  const event = await db.event.findFirst({
    where: {
      id: eventId,
      user: {
        username: username,
      },
    },
    include: {
      user: {
        select: {
          name: true,
          email: true,
          imageUrl: true,
        },
      },
    },
  });

  return event;
}
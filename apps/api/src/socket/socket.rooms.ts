export const socketRooms = {
  assignment: (id: string) => \`assignment:\${id}\`,
  user: (id: string) => \`user:\${id}\`,
  adminQueues: () => 'admin:queues'
};

export const isValidRoomPattern = (room: string): boolean => {
  if (room === 'admin:queues') return true;
  if (room.startsWith('assignment:')) return true;
  if (room.startsWith('user:')) return true;
  return false;
};

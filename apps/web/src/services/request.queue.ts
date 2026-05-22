type FailedQueueItem = {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
};

class RequestQueue {
  private queue: FailedQueueItem[] = [];

  enqueueRequest(): Promise<string> {
    return new Promise((resolve, reject) => {
      this.queue.push({ resolve, reject });
    });
  }

  resolveQueuedRequests(token: string) {
    this.queue.forEach(item => item.resolve(token));
    this.clearQueue();
  }

  rejectQueuedRequests(error: unknown) {
    this.queue.forEach(item => item.reject(error));
    this.clearQueue();
  }

  clearQueue() {
    this.queue = [];
  }
}

export const requestQueue = new RequestQueue();

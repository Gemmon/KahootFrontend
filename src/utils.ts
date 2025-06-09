export function waitFor(condition: () => boolean, timeout = 5000, errorMsg?: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();

    const checkCondition = () => {
      if (condition()) {
        resolve();
      } else if (Date.now() - startTime >= timeout) {
        reject(new Error(errorMsg ?? 'Condition not met within timeout'));
      } else {
        requestAnimationFrame(checkCondition);
      }
    };

    checkCondition();
  });
}

export function getAvatarUrl(username: string): string {
  return `https://ui-avatars.com/api/?background=random&name=${encodeURIComponent(username)}`;
}
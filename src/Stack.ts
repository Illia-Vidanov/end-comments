export class Stack<T>
{
  private data: T[] = [];

  push(...items: T[]): void
  {
    items.forEach(element => {
      this.data.push(element);
    });
  }

  pop(): void
  {
    this.data.pop();
  }

  top(): T
  {
    return this.data[this.data.length - 1];
  }

  // Get top and pop
  extract(): T
  {
    const temp = this.top();
    this.pop();
    return temp;
  }

  size(): number
  {
    return this.data.length;
  }

  empty(): boolean
  {
    return this.data.length == 0;
  }
}
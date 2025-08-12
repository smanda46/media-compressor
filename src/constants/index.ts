import { Platform } from 'react-native';

export const LOGO_BASE64 =
  'iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAIAAADTED8VAAAACXBIWXMAAAsSAAALEgHS3X78AAAgAElEQVR4nO3de5CV1Z3/8deQGmPqk5k0c9iS9m6kqg2b0o3oS1o3eVQX8Cw2J9Vwq3s7v7iQm7sJb2a3b8W3b2yqI2l1QFZJ0mWzq1Cq7Zp9zq3KcT2r8v7w8Hh8+4eY8b7k8fDkQAAABZ8yH6AAAAAAAgfZgAAgAAAHyBAAAAgJ8gAABAgAEAAABAgAEAAABAgAEAAABAgAEAAABAgAEAAABAgAEAAABAgAEAAABAgAEAAABAgAEAAABAgAEAAABAgAEAAABAgAEAAABAgAEAAABAgAEAAABAgAEAAABAgAEAAD/3q8u2m5zqv3yKp5z6pW2ux9q2sSg7r9v6cE3o5mW3r2X7+Kx0m2Yw3s8Hk6WbZ9rj8c7c6bqQ5nM2vQy9k9mUGsQF3R4u5Pxv2k8sQ2N9CX2n4w4c2cQWkEJpfv3w+X8cltM0f8n8r8eQpXfA6kQw4M7rX9B9cQqkS1lq9n5fNQv7mJYQ3wN2mN3E7m3e6mF0mK2c8+P4eP0Xb0fG5R0sU6U5bJcT2mU7b1Hn2h8mJb6n7c4cI0VYVb6XkJp3d8XkT9c0o+AAAAAElFTkSuQmCC';

export const COMPRESS_IMG = {
  compressionMethod: 'auto' as const,
  maxWidth: 1920,
  maxHeight: 1920,
  quality: 0.8,
  output: 'jpg' as const,
};

export const COMPRESS_VID = {
  compressionMethod: 'auto' as const,
};

export const UPLOAD_URL = Platform.select({
  ios: 'http://localhost:3000/upload',
  android: 'http://10.0.2.2:3000/upload',
  default: 'http://localhost:3000/upload',
});

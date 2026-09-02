import { validateMockData } from './src/data/mock/validate';

try {
  validateMockData();
  console.log('Mock data validated successfully!');
} catch (err) {
  console.error(err.message);
  process.exit(1);
}

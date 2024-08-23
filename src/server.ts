if (!process.env.NODE_ENV) {
  throw new Error(
    'NODE_ENV is not defined. Please set it to "development" or "production".'
  );
}
import { config } from './config/env';
import app from './app';

const PORT = config.port || 5005;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

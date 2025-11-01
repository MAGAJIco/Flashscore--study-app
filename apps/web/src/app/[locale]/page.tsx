import { Magajico } from '../components/Magajico';
import { MagajiCoAppLauncher } from '../components/MagajiCoAppLauncher';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <MagajiCoAppLauncher />
      <Magajico />
    </div>
  );
}
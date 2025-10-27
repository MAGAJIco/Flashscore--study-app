
//components/sections/KeyBenefits.tsx

const benefits = [
  '✅ Better Organization',
  '✅ Easier Maintenance',
  '✅ Improved Performance',
  '✅ Team Scalability',
  '✅ Independent Testing',
  '✅ Flexible Deployment',
];

export function KeyBenefits() {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-xl">
      <h2 className="text-3xl font-bold text-indigo-600 mb-6">🚀 Key Benefits</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {benefits.map((benefit, index) => (
          <div 
            key={index}
            className="bg-gradient-to-br from-orange-100 to-pink-200 p-5 rounded-xl font-semibold text-gray-900 transition-all hover:scale-105 hover:shadow-lg cursor-pointer"
          >
            {benefit}
          </div>
        ))}
      </div>
    </div>
  );
}

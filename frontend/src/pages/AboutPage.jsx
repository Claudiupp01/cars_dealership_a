import React from "react";

const AboutPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-slate-900 mb-8">
        About Elite Motors
      </h1>

      <div className="prose prose-lg">
        <p className="text-slate-600 text-lg mb-6">
          Welcome to Elite Motors, your premier destination for luxury and
          performance vehicles. With over 20 years of experience in the
          automotive industry, we've built our reputation on trust, quality, and
          exceptional customer service.
        </p>

        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">
          Our Mission
        </h2>
        <p className="text-slate-600 mb-6">
          We're passionate about connecting discerning buyers with their dream
          vehicles. Every car in our inventory is meticulously inspected,
          certified, and prepared to exceed your expectations.
        </p>

        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">
          Why Choose Us
        </h2>
        <ul className="text-slate-600 space-y-3 mb-6">
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">•</span>
            <span>Carefully curated selection of premium vehicles</span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">•</span>
            <span>Comprehensive vehicle inspections and certifications</span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">•</span>
            <span>Transparent pricing with no hidden fees</span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">•</span>
            <span>Expert financing options tailored to your needs</span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">•</span>
            <span>Worldwide delivery available</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AboutPage;

import React from 'react';

export default function Terms() {
  return (
    <div className="text-white max-w-4xl mx-auto py-12 px-6">
      <h1 className="text-4xl md:text-5xl font-serif text-arcova-gold mb-12">Terms of Service</h1>
      
      <div className="font-sans text-gray-300 space-y-8 leading-relaxed text-sm md:text-base">
        <p className="text-white/50 text-xs tracking-widest uppercase">Last updated: {new Date().toLocaleDateString()}</p>
        
        <p className="text-lg text-white/80">Welcome to RatingApp. These Terms of Service govern your use of our platform. By accessing our website, whether as a browsing consumer, a reviewer, or a verified store owner, you agree to abide by these terms.</p>

        <section>
          <h2 className="text-2xl font-serif text-white mb-4">1. Acceptance of Terms</h2>
          <p>By creating an account or using RatingApp, you accept and agree to be bound by these provisions. If you do not agree to these terms, please do not use our platform.</p>
        </section>

        <section>
          <h2 className="text-2xl font-serif text-white mb-4">2. Consumer Guidelines & Review Policy</h2>
          <p>We rely on our community to provide honest, authentic feedback. When posting reviews, you agree that:</p>
          <ul className="list-disc pl-6 mt-4 space-y-3">
            <li>Your review is based on your own actual, first-hand experience with the business.</li>
            <li>You will not post false, defamatory, hateful, or discriminatory content.</li>
            <li>You have not been compensated or coerced by the business (or a competitor) to write the review.</li>
          </ul>
          <p className="mt-4">We reserve the right to moderate, flag, or remove reviews that violate these guidelines.</p>
        </section>

        <section>
          <h2 className="text-2xl font-serif text-white mb-4">3. Store Owner Rights & Responsibilities</h2>
          <p>We recognize that store owners are integral clients of RatingApp. If you claim a business profile, you agree to the following:</p>
          <ul className="list-disc pl-6 mt-4 space-y-3">
            <li><strong>Verification:</strong> You must provide accurate information to prove your authorized representation of the business.</li>
            <li><strong>Professional Conduct:</strong> When responding to customer reviews, you must maintain a professional and respectful tone. Harassment or doxing of reviewers is strictly prohibited.</li>
            <li><strong>No Manipulation:</strong> You may not artificially inflate your ratings by posting fake reviews, paying for reviews, or offering incentives in exchange for positive feedback.</li>
            <li><strong>Accountability:</strong> RatingApp acts as a neutral platform. We do not arbitrate factual disputes between businesses and consumers, but we provide you the tools to publicly respond to feedback.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-serif text-white mb-4">4. Intellectual Property</h2>
          <p>All platform design, branding, logos, and underlying software are the exclusive property of RatingApp. By submitting a review or business image, you grant us a non-exclusive, royalty-free license to display that content on our platform.</p>
        </section>

        <section>
          <h2 className="text-2xl font-serif text-white mb-4">5. Disclaimer of Warranties</h2>
          <p>RatingApp is provided on an "as is" and "as available" basis. We do not guarantee the factual accuracy of any review. Businesses and consumers use the platform at their own risk.</p>
        </section>

        <section>
          <h2 className="text-2xl font-serif text-white mb-4">6. Limitation of Liability</h2>
          <p>To the maximum extent permitted by law, RatingApp shall not be liable for any indirect, incidental, or consequential damages resulting from your use of the platform, including any loss of revenue or reputation resulting from user-generated content.</p>
        </section>

        <section>
          <h2 className="text-2xl font-serif text-white mb-4">7. Account Termination</h2>
          <p>We reserve the right to suspend or terminate the accounts of consumers or store owners who repeatedly violate these terms, engage in review manipulation, or compromise the integrity of the platform.</p>
        </section>
      </div>
    </div>
  );
}

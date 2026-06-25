export default function Privacy() {
  return (
    <div className="text-white max-w-4xl mx-auto py-12 px-6">
      <h1 className="text-4xl md:text-5xl font-serif text-arcova-gold mb-12">Privacy Policy</h1>
      
      <div className="font-sans text-gray-300 space-y-8 leading-relaxed text-sm md:text-base">
        <p className="text-white/50 text-xs tracking-widest uppercase">Last updated: {new Date().toLocaleDateString()}</p>
        
        <p className="text-lg text-white/80">At RatingApp, we are committed to protecting your privacy. This policy outlines how we collect, use, and safeguard your data, whether you are a consumer leaving reviews or a store owner managing your business profile.</p>

        <section>
          <h2 className="text-2xl font-serif text-white mb-4">1. Information We Collect</h2>
          <h3 className="text-xl font-bold text-arcova-gold mb-2 mt-6">For Consumers:</h3>
          <p className="mb-4">We collect information you provide directly to us when you create an account, submit a review, or communicate with us. This includes your name, email address, profile picture, and any content you post.</p>
          <h3 className="text-xl font-bold text-arcova-gold mb-2 mt-6">For Store Owners:</h3>
          <p>When you claim or register a business, we collect verification information, business contact details, operational hours, and responses you provide to customer reviews. Public business information (such as your address and phone number) is displayed to all users.</p>
        </section>

        <section>
          <h2 className="text-2xl font-serif text-white mb-4">2. How We Use Your Information</h2>
          <p className="mb-4">We use your information to operate and improve our platform. For consumers, this means authenticating your identity and publishing your authentic reviews. For store owners, this means verifying your ownership, allowing you to manage your public storefront, and providing analytics regarding your store's performance.</p>
          <p>We may also use your email address to send important account notifications, security alerts, and platform updates.</p>
        </section>

        <section>
          <h2 className="text-2xl font-serif text-white mb-4">3. Public vs. Private Data</h2>
          <p className="mb-4"><strong>Public Data:</strong> Your reviews, public profile name, and for store owners, your business details and owner responses, are visible to the public.</p>
          <p><strong>Private Data:</strong> Your email address, passwords, payment information (if applicable), and private correspondence with our support team are securely stored and never published or shared with other users.</p>
        </section>

        <section>
          <h2 className="text-2xl font-serif text-white mb-4">4. Information Sharing & Third Parties</h2>
          <p>We do not sell your personal information to third parties. We may share information with trusted service providers who assist us in operating our platform (such as cloud hosting or email delivery services). We may also disclose information if required by law, court order, or to protect the safety and rights of our community.</p>
        </section>

        <section>
          <h2 className="text-2xl font-serif text-white mb-4">5. Data Retention & Deletion</h2>
          <p>We retain your data for as long as your account is active. You have the right to request the deletion of your account and personal data at any time. Store owners who wish to unclaim a business can do so, though the public listing of the business may remain on our platform as a matter of public record.</p>
        </section>

        <section>
          <h2 className="text-2xl font-serif text-white mb-4">6. Security Measures</h2>
          <p>We implement industry-standard encryption and security protocols to protect your personal information from unauthorized access. However, no digital platform is 100% secure, and we cannot guarantee absolute data security.</p>
        </section>

        <section>
          <h2 className="text-2xl font-serif text-white mb-4">7. Contact Us</h2>
          <p>If you have any questions or concerns about this Privacy Policy, your data rights, or our data practices, please contact our privacy team at <span className="text-arcova-gold">privacy@ratingapp.in</span>.</p>
        </section>
      </div>
    </div>
  );
}

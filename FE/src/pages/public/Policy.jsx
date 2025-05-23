import React from "react";

const Policy = () => {
  return (
    <div className="p-10 max-w-4xl mx-auto text-gray-200 bg-gray-900 rounded-lg shadow-lg">
      <h1 className="text-4xl font-bold mb-5 text-green-400">
        Privacy & Policy - IoT Farm
      </h1>

      <h2 className="text-2xl font-semibold mt-4 text-green-300">
        Introduction:
      </h2>
      <p className="text-lg">
        At IoT Farm, we are committed to protecting the privacy and security of
        your personal information. This Privacy & Policy outlines how we
        collect, use, disclose, and safeguard your data when you visit our
        website, use our services, or interact with us in any way. By using our
        services, you consent to the practices described in this policy.
      </p>

      <h2 className="text-2xl font-semibold mt-4 text-green-300">
        Information We Collect:
      </h2>
      <h3 className="font-semibold mt-2 text-green-200">
        Personal Information:
      </h3>
      <ul className="list-disc pl-5 text-lg">
        <li>Name, email address, phone number, and postal address.</li>
        <li>Account credentials (username and password).</li>
        <li>Payment information (if applicable).</li>
        <li>Any other information you voluntarily provide to us.</li>
      </ul>

      <h3 className="font-semibold mt-2 text-green-200">Usage Data:</h3>
      <ul className="list-disc pl-5 text-lg">
        <li>
          Information about how you interact with our website and services,
          including IP address, browser type, and pages visited.
        </li>
        <li>Data collected through cookies and similar technologies.</li>
        <li>
          Information collected from IoT devices on our farm, related to
          environmental conditions and crop health. (This data is mostly for
          internal use to improve farm output and will not be sold to third
          parties.)
        </li>
      </ul>

      <h3 className="font-semibold mt-2 text-green-200">IoT Data:</h3>
      <ul className="list-disc pl-5 text-lg">
        <li>
          Data collected from sensors and devices on our farm, such as soil
          moisture, temperature, and humidity.
        </li>
        <li>
          This data is used to optimize our farming practices and improve our
          products.
        </li>
      </ul>

      <h2 className="text-2xl font-semibold mt-4 text-green-300">
        How We Use Your Information:
      </h2>
      <h3 className="font-semibold mt-2 text-green-200">
        To Provide and Improve Our Services:
      </h3>
      <ul className="list-disc pl-5 text-lg">
        <li>To process orders and provide customer support.</li>
        <li>
          To personalize your experience and improve our website and services.
        </li>
        <li>To analyze data and optimize our farming practices.</li>
      </ul>

      <h3 className="font-semibold mt-2 text-green-200">
        To Communicate With You:
      </h3>
      <ul className="list-disc pl-5 text-lg">
        <li>To send you updates, newsletters, and promotional materials.</li>
        <li>
          To respond to your inquiries and provide information about our
          products and services.
        </li>
      </ul>

      <h3 className="font-semibold mt-2 text-green-200">To Ensure Security:</h3>
      <ul className="list-disc pl-5 text-lg">
        <li>
          To protect our website and services from fraud and unauthorized
          access.
        </li>
        <li>To comply with legal obligations.</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-4 text-green-300">
        Data Sharing and Disclosure:
      </h2>
      <ul className="list-disc pl-5 text-lg">
        <li>
          <strong>Service Providers:</strong> Third-party vendors who assist us
          with payment processing, data analysis, and other services.
        </li>
        <li>
          <strong>Legal Compliance:</strong> When required by law or to protect
          our rights and safety.
        </li>
        <li>
          <strong>Business Transfers:</strong> In connection with a merger,
          acquisition, or sale of assets.
        </li>
        <li>
          <strong>With Consent:</strong> We may share information with third
          parties with your consent.
        </li>
        <li>
          <strong>IoT Data Handling:</strong> The data collected from IoT
          devices on our farm is primarily used for internal analysis and will
          not be sold to third parties.
        </li>
      </ul>

      <h2 className="text-2xl font-semibold mt-4 text-green-300">
        Cookies and Tracking Technologies:
      </h2>
      <p className="text-lg">
        We use cookies and similar technologies to collect information about
        your browsing behavior. You can control cookies through your browser
        settings.
      </p>

      <h2 className="text-2xl font-semibold mt-4 text-green-300">
        Data Security:
      </h2>
      <p className="text-lg">
        We implement appropriate security measures to protect your information
        from unauthorized access, disclosure, or alteration.
      </p>

      <h2 className="text-2xl font-semibold mt-4 text-green-300">
        Your Rights:
      </h2>
      <ul className="list-disc pl-5 text-lg">
        <li>Access and update your personal information.</li>
        <li>Request deletion of your personal information.</li>
        <li>Opt out of receiving marketing communications.</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-4 text-green-300">
        Changes to This Policy:
      </h2>
      <p className="text-lg">
        We may update this Privacy & Policy from time to time. We will notify
        you of any changes by posting the new policy on our website.
      </p>
    </div>
  );
};

export default Policy;

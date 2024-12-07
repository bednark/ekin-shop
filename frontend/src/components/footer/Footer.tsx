export default function Footer() {
  return (
    <footer className="p-5 bg-black text-white text-center">
      <div className="flex justify-center basis-1/2">
        <div className="mb-5">
          <iframe
            title="Google Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.086509486947!2d144.9630579153167!3d-37.81410797975195!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad642af0f11fd81%3A0xf577d1b6e1b0c1e9!2sFederation%20Square!5e0!3m2!1sen!2sau!4v1633072800000!5m2!1sen!2sau"
            width="500"
            height="350"
            className="border-0"
            allowFullScreen={false}
            loading="lazy"
          ></iframe>
        </div>
        <div className="basis-1/2 flex justify-center flex-col">
          <h2 className="text-xl font-bold">Contact Us</h2>
          <p>Company Name: Ekin Shop</p>
          <p>Address: 123 Main Street, City, Country</p>
          <p>Phone: +123 456 789</p>
          <p>Email: info@ekinshop.com</p>
        </div>
      </div>
    </footer>
  );
};
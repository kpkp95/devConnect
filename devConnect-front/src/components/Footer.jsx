const Footer = () => {
  return (
    <footer className="footer footer-center fixed bottom-0 w-full border-t border-base-content/10 bg-base-300 p-4 text-base-content">
      <aside>
        <p className="text-xs sm:text-sm">
          © {new Date().getFullYear()} devConnect. Built for meaningful
          connections.
        </p>
      </aside>
    </footer>
  );
};

export default Footer;

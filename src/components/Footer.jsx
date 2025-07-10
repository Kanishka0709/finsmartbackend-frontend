import React from 'react';

function Footer() {
  return (
    <footer className="footer-pro bg-navy text-white p-4 text-center">
      &copy; {new Date().getFullYear()} Finsmart Finances. All rights reserved.
    </footer>
  );
}

export default Footer;
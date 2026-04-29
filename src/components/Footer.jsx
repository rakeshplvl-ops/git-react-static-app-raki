import "../css/footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>Taskz &copy; {new Date().getFullYear()} - Built for productivity</p>
      </div>
    </footer>
  );
}

export default Footer;

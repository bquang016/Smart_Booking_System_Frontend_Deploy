import ReactDOM from "react-dom";

export default function ToastPortal({ children }) {
  const root = document.getElementById("toast-root") || document.body;
  return ReactDOM.createPortal(children, root);
}

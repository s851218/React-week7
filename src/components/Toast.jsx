import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Toast as BsToast } from "bootstrap";
import { removeMessage } from "../slice/toastSlice";

export default function Toast() {
  const toastMessages = useSelector((state) => state.toast.messages);

  const toastRefs = useRef({});

  const dispatch = useDispatch();

  const TOAST_DURATION = 3000;

  useEffect(() => {
    toastMessages.forEach((message) => {
      const toastElement = toastRefs.current[message.id];

      if (toastElement) {
        const toastInstance = new BsToast(toastElement);
        toastInstance.show();
      }

      setTimeout(() => {
        dispatch(removeMessage(message.id));
      }, TOAST_DURATION);
    });
  }, [toastMessages]);

  const handleDismiss = (message_id) => {
    dispatch(removeMessage(message_id));
  };

  return (
    <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 1000 }}>
      {toastMessages.map((message) => (
        <div
          key={message.id}
          ref={(el) => (toastRefs.current[message.id] = el)}
          className="toast"
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          <div
            className={`toast-header ${
              message.status === "success" ? "bg-success" : "bg-danger"
            } text-white`}
          >
            <strong className="me-auto">
              {message.status === "success" ? "成功" : "失敗"}
            </strong>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={() => handleDismiss(message.id)}
            ></button>
          </div>
          <div className="toast-body">{message.text}</div>
        </div>
      ))}
    </div>
  );
}

import { Modal } from "flowbite-react";
import PropTypes from "prop-types";

function PlanningModal({
  trigger,
  toggle,
  header,
  body,
  footer,
  size = "lg",
  isProfile,
}) {
  return (
    <Modal
      show={trigger}
      dismissible
      position="center"
      theme={{
        content: { base: "relative h-auto w-full p-4 animate-fade" },
        body: { base: "p-2" },
        footer: {
          base: "flex items-center justify-end space-x-2 border-gray-200 p-4 dark:border-gray-600",
        },
      }}
      onClose={() => {
        toggle((prev) => (isProfile ? null : !prev));
      }}
      size={size}
    >
      <Modal.Header>{header}</Modal.Header>
      <Modal.Body>{body}</Modal.Body>
      {footer && <Modal.Footer>{footer}</Modal.Footer>}
    </Modal>
  );
}

PlanningModal.propTypes = {
  isProfile: PropTypes.bool,
  trigger: PropTypes.bool,
  toggle: PropTypes.func,
  header: PropTypes.node,
  body: PropTypes.node,
  footer: PropTypes.node,
  size: PropTypes.string,
};

export default PlanningModal;

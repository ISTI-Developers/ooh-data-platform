import { TextInput } from "flowbite-react";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { defaultTextTheme } from "~config/themes";

function ForgotPassword() {
  const email = useRef(null);
  const validateEmailAddress = (e) => {
    e.preventDefault();
  };
  return (
    <div className="flex items-center justify-center h-[70vh]">
      <div className="max-w-sm w-full bg-white shadow flex flex-col items-center p-4 gap-4">
        <header className="w-full pb-2 border-b">
          <p className="text-2xl font-semibold">Password Recovery</p>
        </header>
        <main className="w-full flex flex-col gap-4">
          <form
            method="POST"
            className="flex flex-col gap-4"
            onSubmit={validateEmailAddress}
          >
            <div className="flex flex-col gap-4">
              <p className="text-center">
                To change your password, please enter your registered email
                address. There we will send you the instructions and the link
                for the password recovery.
              </p>
              <TextInput
                id="email_address"
                required
                size="md"
                defaultValue=""
                placeholder="Email address"
                ref={email}
                theme={defaultTextTheme}
              />
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}

export default ForgotPassword;

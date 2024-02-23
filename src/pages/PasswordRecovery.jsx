import { Button, TextInput } from "flowbite-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "~config/AuthContext";
import { defaultTextTheme, mainButtonTheme } from "~config/themes";

function PasswordRecovery() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [passwords, setPasswords] = useState({
    new: "",
    confirm: "",
  });

  const { changePassword, setAlert } = useAuth();

  const verifyPassword = async (e) => {
    e.preventDefault();

    console.log(id, passwords);
    const response = await changePassword(id, passwords.confirm);
    console.log(response);

    if (response?.success) {
      setAlert({
        isOn: true,
        type: "success",
        message:
          "Password change success. You may now login with your new password.",
      });
      navigate("/login");
    } else {
      setAlert({
        isOn: true,
        type: "failure",
        message: "An error occured.",
      });
    }
  };
  return (
    <div className="flex items-center justify-center h-[70vh]">
      <div className="max-w-lg w-full bg-white shadow flex flex-col items-center p-4 gap-4">
        <header className="w-full pb-2 border-b">
          <p className="text-2xl font-semibold">Reset Account Password</p>
        </header>
        <main className="w-full flex flex-col gap-4 text-lg">
          <form
            method="POST"
            className="flex flex-col gap-4"
            onSubmit={verifyPassword}
          >
            <div className="flex flex-col gap-4">
              <p className="text-center">
                Enter a new password for your account.
              </p>
              <PasswordFieldWithValidation
                id="new"
                placeholder="New Password"
                passwords={passwords}
                setPasswords={setPasswords}
              />
              <PasswordFieldWithValidation
                id="confirm"
                placeholder="Confirm New Password"
                passwords={passwords}
                setPasswords={setPasswords}
              />
            </div>
            <Button
              type="submit"
              color="transparent"
              className="bg-secondary text-white"
              theme={mainButtonTheme}
            >
              Submit
            </Button>
          </form>
        </main>
      </div>
    </div>
  );
}

function PasswordFieldWithValidation({
  id,
  placeholder,
  setPasswords,
  passwords,
}) {
  const [errors, setErrors] = useState(null);
  const [isFocus, setFocus] = useState(false);

  const checkPasswordStrength = (e) => {
    const { value } = e.target;
    const errorsArray = [];

    if (value.length < 8) {
      errorsArray.push("must have at least 8 characters");
    }
    if (!/[A-Z]/.test(value)) {
      errorsArray.push("must have at least 1 uppercase letter");
    }
    if (!/[a-z]/.test(value)) {
      errorsArray.push("must have at least 1 lowercase letter");
    }
    if (!/\d/.test(value)) {
      errorsArray.push("must have at least 1 number");
    }
    if (!/[!@#$%^&*._]/.test(value)) {
      errorsArray.push("must have at least 1 symbol");
    }
    if (id === "confirm") {
      if (value !== passwords.new) {
        errorsArray.push("passwords do not match");
      }
    }

    setErrors(errorsArray);
    setPasswords((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  return (
    <div className="flex flex-col gap-4">
      <TextInput
        id={id}
        type="password"
        required
        size="md"
        onFocus={() => setFocus(true)}
        autoComplete="false"
        autoCorrect="false"
        value={passwords[id]}
        placeholder={placeholder}
        color={
          errors !== null
            ? errors.length === 0
              ? "success"
              : "failure"
            : "gray"
        }
        theme={defaultTextTheme}
        onChange={checkPasswordStrength}
      />
      {isFocus && errors?.length > 0 && (
        <ul className="text-sm p-2 px-8 bg-red-100 rounded">
          {errors.map((error, index) => (
            <li className="list-disc text-red-700" key={index}>
              {error}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default PasswordRecovery;

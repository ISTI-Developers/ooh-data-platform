import { Button, TextInput } from "flowbite-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "~config/AuthContext";
import { defaultTextTheme, mainButtonTheme } from "~config/themes";
import PropTypes from "prop-types";

function PasswordRecovery() {
  //initialize the variables
  //id is retrieved from the url
  const { id } = useParams();
  const navigate = useNavigate();
  const [passwords, setPasswords] = useState({
    new: "",
    confirm: "",
  });

  //initialize the functions from custom context
  const { changePassword, setAlert } = useAuth();

  //function for verifying the password and passing to backend for updating the user's password.
  const verifyPassword = async (e) => {
    e.preventDefault();

    const response = await changePassword(id, passwords.confirm);

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


//Custom component for password field with password strength checking
function PasswordFieldWithValidation({
  id,
  placeholder,
  setPasswords,
  passwords,
}) {
  const [errors, setErrors] = useState(null);
  const [isFocus, setFocus] = useState(false);

  //function for checking password strength
  const checkPasswordStrength = (e) => {
    const { value } = e.target;
    const errorsArray = [];

    if (value.length < 8) {
      errorsArray.push("must have at least 8 characters");
    }
    //regex for all uppercase letters
    if (!/[A-Z]/.test(value)) {
      errorsArray.push("must have at least 1 uppercase letter");
    }
    //regex for all lowercase letters
    if (!/[a-z]/.test(value)) {
      errorsArray.push("must have at least 1 lowercase letter");
    }
    //regex for numbers
    if (!/\d/.test(value)) {
      errorsArray.push("must have at least 1 number");
    }
    //regex for the usable symbols
    if (!/[!@#$%^&*._]/.test(value)) {
      errorsArray.push("must have at least 1 symbol");
    }
    //show this error text when entering in password confirm field
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

      {/* showing of errors if there are any. */}
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

//setting the types of PasswordFiledWithValidation properties
PasswordFieldWithValidation.propTypes = {
  id: PropTypes.string,
  placeholder: PropTypes.string,
  setPasswords: PropTypes.func,
  passwords: PropTypes.object,
};
export default PasswordRecovery;

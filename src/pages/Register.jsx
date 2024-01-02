import useUser from "../config/userStore";
import { Button } from "flowbite-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { mainButtonTheme } from "../config/themes";
import PasswordField from "../fragments/PasswordField";
import TextField from "../fragments/TextField";
function Register() {
  const [user, setUser] = useState({
    first_name: "",
    last_name: "",
    email_address: "",
    password: "",
    confirm_password: "",
  });

  const handleRegister = (e) => {
    e.preventDefault();

    console.log("registering");
  };
  const onFieldUpdate = (e) => {
    setUser((user) => ({ ...user, [e.target.id]: e.target.value }));
  };

  return (
    <div className="flex items-center justify-center h-full -translate-y-[75px]">
      <div className="max-w-lg w-full bg-white shadow flex flex-col items-center p-4 gap-4">
        <header className="w-full pb-2 border-b">
          <p className="text-2xl font-semibold">Register Account</p>
          {/* <p>Stay informed about your Out-of-Home Advertising </p> */}
        </header>
        <main className="w-full flex flex-col gap-4">
          <form
            method="POST"
            className="flex flex-col gap-4"
            onSubmit={handleRegister}
          >
            <div className="flex items-center gap-4">
              <div className="w-1/2">
                <TextField
                  id="first_name"
                  item={user}
                  onChange={onFieldUpdate}
                />
              </div>
              <div className="w-1/2">
                <TextField
                  id="last_name"
                  item={user}
                  onChange={onFieldUpdate}
                />
              </div>
            </div>
            {Object.keys(user).map((item) => {
              return !item.includes("password") ? (
                <>
                  {!item.includes("name") && (
                    <div key={item}>
                      <TextField
                        id={item}
                        type="email"
                        item={user}
                        onChange={onFieldUpdate}
                      />
                    </div>
                  )}
                </>
              ) : (
                <PasswordField
                  id={item}
                  item={user}
                  onChange={onFieldUpdate}
                  key={item}
                />
              );
            })}
            <Link
              to="/login"
              className="text-sm font-semibold text-secondary w-fit"
            >
              Forgot Password?
            </Link>
            <Button type="submit" color="light" theme={mainButtonTheme}>
              Log in
            </Button>
          </form>
        </main>
        <div className="text-sm">
          Need an account?{" "}
          <Link to="/login" className="text-secondary">
            Register Now!
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;

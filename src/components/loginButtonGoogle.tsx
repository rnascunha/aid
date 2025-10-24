import { googleLogin } from "@/actions/auth";
import Image from "next/image";

import googleLogo from "@/images/google-nobg.png";
import { Button } from "@mui/material";

export default function LoginGoogleButton({ redirect }: { redirect: string }) {
  const signInFn = googleLogin.bind(null, redirect);
  return (
    <form action={signInFn}>
      <Button
        variant="contained"
        type="submit"
        sx={{
          p: 1,
          bgcolor: "rgba(200, 200, 200, 0.4)"
        }}
      >
        <Image src={googleLogo} width={250} alt="Login google" priority />
      </Button>
    </form>
  );
}

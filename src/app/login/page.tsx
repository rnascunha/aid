import { Stack, Typography } from "@mui/material";
import LoginGoogleButton from "@/components/loginButtonGoogle";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { loginPath, restrictedPath } from "@/constants";
import ModeSwitch from "@/components/modeSwitch";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
  openGraph: {
    title: "Login",
  },
  twitter: {
    title: "Login",
  },
};

function ErrorOutput(err: string) {
  if (err === "AccessDenied") return "Usuário não autorizado";
  return `Error: ${err}`;
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const session = await auth();
  const { redirect: to, error } = await searchParams;

  if (session?.user) redirect((to as string) ?? restrictedPath);

  return (
    <Stack
      justifyContent="center"
      alignItems="center"
      sx={{
        height: "100%",
      }}
    >
      <ModeSwitch
        sx={{
          position: "absolute",
          top: "10px",
          right: "5px",
        }}
      />
      <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
        AId
      </Typography>
      <Typography>
        <i>Login com</i>
      </Typography>
      <LoginGoogleButton redirect={(to as string) ?? loginPath} />
      {error && (
        <Typography
          sx={{
            color: "red",
            fontStyle: "italic",
          }}
        >
          {ErrorOutput(error as string)}
        </Typography>
      )}
    </Stack>
  );
}

import { Stack, Typography } from "@mui/material";
import { SideMenuContent } from "@/components/sideMenu";

export default function HomePage() {
  return (
    <Stack
      justifyContent="center"
      alignItems="center"
      sx={{
        height: "100%",
        width: "100%",
      }}
    >
      <Typography component="h2" variant="h3">
        AId
      </Typography>
      <Stack
        justifyContent="center"
        alignItems="center"
        sx={{
          position: "relative",
          flex: 1,
          width: "100%",
          overflow: "auto",
        }}
      >
        <SideMenuContent
          sx={{
            maxWidth: "400px",
            width: "100%",
            position: "absolute",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
          }}
        />
      </Stack>
    </Stack>
  );
}

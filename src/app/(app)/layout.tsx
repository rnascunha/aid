import NavBar from "@/components/navbar/navbar";
import {
  MainContent,
  SideMenuContent,
  SideMenuContextWrapper,
} from "@/components/sideMenu";
import { Container, Stack } from "@mui/material";
import { ReactNode } from "react";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <SideMenuContextWrapper>
      <Stack
        sx={{
          width: "100dvw",
          height: "100dvh",
          overflow: "hidden",
        }}
      >
        <NavBar />
        <MainContent
          width={240}
          leftMenuChildren={<SideMenuContent sx={{ mt: "51px" }} />}
        >
          <Container
            maxWidth="xl"
            disableGutters
            sx={{
              height: "100%",
              flex: 1,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            {children}
          </Container>
        </MainContent>
      </Stack>
    </SideMenuContextWrapper>
  );
}

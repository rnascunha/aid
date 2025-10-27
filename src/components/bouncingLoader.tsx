import Box, { BoxProps } from "@mui/material/Box";

export function BouncingLoader(props: BoxProps) {
  const { sx, ...others } = props;
  return (
    <Box
      sx={{
        ...sx,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        "& div": {
          display: "inline-block",
          // backgroundColor: "primary.main", // Or your desired color
          backgroundColor: "rgb(200, 200, 200)",
          width: 12,
          height: 12,
          borderRadius: "50%",
          animation: "bouncing-loader 0.3s ease-in infinite alternate",
          margin: "0 4px",
        },
        "@keyframes bouncing-loader": {
          "0%": {
            opacity: 0.1,
            transform: "translateY(-8px)",
          },
          "100%": {
            opacity: 1,
            transform: "translateY(0)",
          },
        },
      }}
      {...others}
    >
      <Box sx={{ animationDelay: "0.0s !important" }} />
      <Box sx={{ animationDelay: "0.1s !important" }} />
      <Box sx={{ animationDelay: "0.2s !important" }} />
    </Box>
  );
}

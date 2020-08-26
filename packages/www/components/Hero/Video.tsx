import { Text } from "@theme-ui/components";
import { FiEye, FiHeart } from "react-icons/fi";
import { IconButton } from "@theme-ui/components";
import { phoneAspectRatio, notchZIndex } from "./PhoneSvg";

const HeroVideo = () => {
  return (
    <div
      sx={{
        maxWidth: "916px",
        width: "100%",
        mx: "auto",
        position: "absolute",
        zIndex: notchZIndex - 1,
        top: 0
      }}
    >
      <figure
        sx={{
          pb: phoneAspectRatio,
          width: "100%",
          overflow: "hidden",
          borderRadius: 24,
          position: "relative"
        }}
      >
        <video
          src="/img/video-placeholder.mp4"
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            bottom: 0,
            right: 0
          }}
          autoPlay
        />
        <div
          sx={{
            position: "absolute",
            top: 3,
            left: 3,
            display: "flex",
            alignItems: "center",
            width: "fit-content"
          }}
        >
          <Text
            sx={{
              bg: "primary",
              borderRadius: 24,
              textTransform: "uppercase",
              fontWeight: "bold",
              color: "background",
              px: 2,
              py: 1,
              mr: 2
            }}
          >
            Live
          </Text>
          <Text
            sx={{
              display: "flex",
              alignItems: "center",
              fontWeight: "bold",
              borderRadius: 24,
              px: 2,
              py: 1,
              color: "background",
              bg: "rgba(0,0,0,0.5)"
            }}
          >
            <i sx={{ display: "flex", alignItems: "center", mr: 1 }}>
              <FiEye />
            </i>
            16
          </Text>
        </div>
        <div
          sx={{
            position: "absolute",
            bottom: 3,
            left: 3,
            right: 3,
            display: "flex",
            alignItems: "center"
          }}
        >
          <input
            placeholder="Write a comment..."
            sx={{
              borderRadius: 24,
              width: "100%",
              bg: "rgba(0,0,0,0.5)",
              mr: 3,
              px: 3,
              height: "42px",
              color: "background",
              fontSize: "14px",
              "&:placeholder": {
                color: "#CDCDCD"
              },
              "&:focus": {
                outline: "none",
                boxShadow: "0px 0px 0px 3px rgba(148, 60, 255, 0.3)",
                borderColor: "primary"
              }
            }}
          />
          <IconButton
            sx={{
              background: "linear-gradient(180deg, #BD90F2 0%, #943CFF 100%)",
              borderRadius: "50%",
              color: "background",
              height: "42px",
              width: "42px",
              minWidth: "42px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <FiHeart />
          </IconButton>
        </div>
      </figure>
    </div>
  );
};

export default HeroVideo;

import { Span } from "@chakra-ui/react";

export default function MaterialIcon(props: { icon: string; [key: string]: any }) {
  return (
    <Span className={"material-symbols-outlined"} {...props}>
      {props.icon}
    </Span>
  );
}

import React from "react";

type LayoutProps = Readonly<{
  children: React.ReactNode;
}>;

const AuthLayout = (props: LayoutProps) => (
  <div className="min-h-screen grid place-content-center">{props.children}</div>
);

export default AuthLayout;

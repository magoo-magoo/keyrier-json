import * as React from "react";

const CustomLoading = (
  props: LoadableExport.LoadingComponentProps,
  componentName?: string
) => {
  if (props.error) {
    return <div>{props.error}</div>;
  }

  if (process.env.NODE_ENV === "production") {
    return <React.Fragment />;
  }

  if (typeof componentName === "string") {
    return <div>{componentName} loading...</div>;
  }

  return <div>Loading...</div>;
};

export const Loading = (componentName: string) => (
  props: LoadableExport.LoadingComponentProps
) => CustomLoading(props, componentName);

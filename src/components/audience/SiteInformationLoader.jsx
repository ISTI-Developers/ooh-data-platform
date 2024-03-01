import Loader from "~fragments/Loader";

function SiteInformationLoader() {
  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex gap-4 w-full h-[37.5rem]">
        <div className="bg-white w-2/6 h-full shadow p-2 flex flex-col gap-2">
          <Loader height="3rem" />
          <Loader height="1rem" />
          <Loader height="31rem" />
        </div>
        <div className="bg-white w-4/6 h-full shadow p-2 flex flex-col gap-2">
          <Loader height="3.5rem" />
          <Loader height="1rem" />
          <div className="flex flex-row gap-4 h-full">
            <div className="flex flex-col gap-4 w-1/2">
              <div className="flex flex-col gap-2">
                <div className="w-1/3">
                  <Loader height="1rem" />
                </div>
                <div className="w-2/3">
                  <Loader height="1rem" />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="w-1/3">
                  <Loader height="1rem" />
                </div>
                <div className="w-2/3">
                  <Loader height="1rem" />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="w-1/3">
                  <Loader height="1rem" />
                </div>
                <div className="w-2/3">
                  <Loader height="1rem" />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="w-1/3">
                  <Loader height="1rem" />
                </div>
                <div className="w-2/3">
                  <Loader height="1rem" />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="w-1/3">
                  <Loader height="1rem" />
                </div>
                <div className="w-2/3">
                  <Loader height="1rem" />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="w-1/3">
                  <Loader height="1rem" />
                </div>
                <div className="w-2/3">
                  <Loader height="1rem" />
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-4 w-1/2">
              <div className="flex flex-col gap-2">
                <div className="w-1/3">
                  <Loader height="1rem" />
                </div>
                <div className="w-2/3">
                  <Loader height="1rem" />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="w-1/3">
                  <Loader height="1rem" />
                </div>
                <div className="w-2/3">
                  <Loader height="1rem" />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="w-1/3">
                  <Loader height="1rem" />
                </div>
                <div className="w-2/3">
                  <Loader height="1rem" />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="w-1/3">
                  <Loader height="1rem" />
                </div>
                <div className="w-2/3">
                  <Loader height="1rem" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AnalyticsLoader() {
  return (
    <>
      <div className="flex h-[14rem] gap-4 bg-white p-4 shadow">
        <div className="w-full lg:w-1/4">
          <Loader height="12rem" />
        </div>
        <div className="w-full lg:w-1/4">
          <Loader height="12rem" />
        </div>
        <div className="w-full lg:w-1/4">
          <Loader height="12rem" />
        </div>
        <div className="w-full lg:w-1/4">
          <Loader height="12rem" />
        </div>
      </div>
      <div className="w-1/4">
        <Loader />
      </div>
      <div className="flex h-[15rem] gap-4">
        <div className="w-full lg:w-1/3">
          <Loader height="15rem" />
        </div>
        <div className="w-full lg:w-1/3">
          <Loader height="15rem" />
        </div>
        <div className="w-full lg:w-1/3">
          <Loader height="15rem" />
        </div>
      </div>
      <div className="h-[15rem]  bg-white p-4 shadow">
        <Loader height="13rem" />
      </div>
    </>
  );
}
export default SiteInformationLoader;

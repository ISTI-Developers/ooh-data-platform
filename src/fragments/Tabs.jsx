import { useRef } from "react";
import PropTypes from "prop-types";
import { Button } from "flowbite-react";
import classNames from "classnames";
import { baseButtonTheme } from "~config/themes";
import { useFunction } from "~config/functions";
import { MdArrowBackIos, MdArrowForwardIos } from "react-icons/md";

function Tabs({ tabs, content, activeTab, setActiveTab }) {
  const tabList = useRef(null);
  const { toSpaced } = useFunction();
  return (
    <div className="relative p-1">
      <header
        ref={tabList}
        className="group flex overflow-x-auto border-b-2 scrollbar-none p-2 gap-2 snap-x snap-mandatory scroll-px-2 scroll-smooth"
      >
        {tabs.map((category, index) => {
          return (
            <Button
              key={index}
              className={classNames(
                "ring-0 focus:ring-0 whitespace-nowrap uppercase snap-start hover:text-secondary ",
                activeTab === category && "text-secondary-hover"
              )}
              size="xs"
              color="light"
              theme={baseButtonTheme}
              onClick={() => setActiveTab(category)}
            >
              {toSpaced(category)}
            </Button>
          );
        })}
        {tabs.length > 2 && (
          <>
            <button
              className={classNames(
                "absolute top-[24px] left-0 h-full -translate-y-1/2 transition-all bg-gradient-to-r from-white from-50% to-transparent px-2 outline-none"
              )}
              onClick={() => {
                if (tabList.current) {
                  tabList.current.scrollLeft -= 250;
                }
              }}
            >
              <MdArrowBackIos />
            </button>
            <button
              className={classNames(
                "absolute top-[24px] right-0 -translate-y-1/2 transition-all bg-gradient-to-l from-white from-50% to-transparent px-2 outline-none"
              )}
              onClick={() => {
                if (tabList.current) {
                  tabList.current.scrollLeft += 250;
                }
              }}
            >
              <MdArrowForwardIos />
            </button>
          </>
        )}
      </header>
      <main className="p-1">{content}</main>
    </div>
  );
}

Tabs.propTypes = {
  tabs: PropTypes.array,
  content: PropTypes.node,
  activeTab: PropTypes.string,
  setActiveTab: PropTypes.func,
};

export default Tabs;

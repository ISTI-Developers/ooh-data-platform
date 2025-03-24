import { Button, Label, Modal, TextInput } from "flowbite-react";
import { useRef } from "react";
import { defaultTextTheme, mainButtonTheme } from "~config/themes";
import { format } from "date-fns";
import "jspdf-autotable";
import { AiOutlineLoading } from "react-icons/ai";
import jsPDF from "jspdf";
import { useCampaigns } from "~config/Campaigns";

export default function PrintAllModal() {
  const { show, toggleModal, reports, charts, generateReport } = useCampaigns();
  const title = useRef();
  const client = useRef();

  const exportReports = () => {
    let pdf = new jsPDF("p", "mm", "legal");
    let index = 0;

    for (const report of reports) {
      const { site, details } = report;
      const { dates } = details;
      const currentChart = Object.values(charts[index].charts);
      const weeklyImpressions = details.entries.weekly.map((item) => {
        return [item.period, item.impressions.toLocaleString()];
      });
      const columns = [
        { title: "Week", dataKey: "period" },
        { title: "Impressions", dataKey: "impressions" },
      ];
      const impressionDetails = `Impressions Period: ${format(
        new Date(dates.from),
        "MMMM d, yyyy"
      )} - ${format(new Date(dates.to), "MMMM d, yyyy")}`;
      const address = `Address: ${site.city}, ${site.region}`;
      const currentSite = site.site;

      pdf = generateReport(
        pdf,
        title.current.value,
        currentSite,
        address,
        client.current.value,
        impressionDetails,
        columns,
        weeklyImpressions,
        currentChart
      );
      if (index != reports.length - 1) {
        pdf.addPage();
      }
      index = index + 1;
    }
    pdf.save(`${title.current.value}.pdf`);
  };
  if (show === "all") {
    return (
      <Modal show={show !== null} dismissible onClose={() => toggleModal(null)}>
        <Modal.Header>Print All Impressions</Modal.Header>
        <Modal.Body>
          {show !== null && (
            <>
              <form className="flex flex-col gap-4">
                <div>
                  <Label htmlFor="title" value="Title" required />
                  <TextInput
                    id="title"
                    theme={defaultTextTheme}
                    ref={title}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="client" value="Client Name" />
                  <TextInput
                    id="client"
                    theme={defaultTextTheme}
                    placeholder="optional"
                    ref={client}
                  />
                </div>
              </form>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            type="button"
            color="warning"
            processingSpinner={
              <AiOutlineLoading className="h-6 w-6 animate-spin" />
            }
            theme={mainButtonTheme}
            className="bg-[#ec9912] w-[150px] ml-auto"
            onClick={exportReports}
          >
            Export
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

import React, { useEffect, useState } from "react";
import RepeatFetcher from "../../RepeatFetcher";
import ExpandableItem from "../../ExpandableItem";

const CheckPanel = ({ day }) => {
  const [labelCheck, setLabelCheck] = useState(null);
  const [weekCache, setCache] = useState([]);
  const [weekStart, setWs] = useState(null);
  const [weekEnd, setWe] = useState(null);

  const rf = new RepeatFetcher();

  useEffect(() => {
    const effect = async () => {
      let cache = [];

      if (day != null) {
        // If this week is cached, dont pull it
        if (day >= weekStart && day < weekEnd) {
          cache = weekCache;
        } else {
          // Reset the cache params
          const dt = new Date(day);
          dt.setHours(0);
          dt.setMinutes(0);
          dt.setSeconds(0);
          dt.setDate(dt.getDate() - dt.getDay());
          setWs(new Date(dt));

          dt.setDate(dt.getDate() + 7);
          setWe(dt);

          // Update Cache
          await rf.getResults(day).then((checks) => {
            cache = checks.dailyResults;
          });
        }
      }

      setLabelCheck(
        cache.filter(({ date }) => {
          return date.getDate() === day.getDate();
        })[0]
      );

      setCache(cache);
    };

    effect();
  }, [day]);

  const formatDateIntoHeader = (dt) => {
    const str = dt.getMonth() + "/" + dt.getDate() + "/" + dt.getFullYear();
    return str;
  };

  const getListItem = (finding, index, repeat = false) => {
    const str = finding.type.concat(": ", finding.product);

    return (
      <div
        key={index}
        className="relative flex items-center justify-start group"
      >
        <div className="break-normal">
          <p>{str}</p>
          {repeat && <span className="text-red-600 font-semibold">x2</span>}
        </div>

        {finding.type != "No Label" && (
          <div className="tool-tip group-hover:scale-100">
            {finding.initials ? finding.initials : "??"}
          </div>
        )}
      </div>
    );
  };

  const parseShift = (shift, name) => {
    const vio = shift.violations.map((finding, i) => {
      return getListItem(finding, i);
    });

    const rep = shift.repeats.map((finding, i) => {
      return getListItem(finding, i, true);
    });

    const anything = rep.length + vio.length;

    return (
      <>
        <h4 className="shift-heading">
          {name}: {!anything ? "🏅" : null}
        </h4>
        {anything != 0 && (
          <>
            {vio}
            {rep}
          </>
        )}
      </>
    );
  };

  const getScorePanel = (labelCheck) => {
    return (
      <div className="border-[2px] sub-panel p-2">
        <div className="shift-heading mb-2 text-lg">
          Score: {labelCheck.score}
        </div>
        <div className="list">
          {parseShift(labelCheck.kitchen.am, "BOH AM")}
        </div>
        <div className="list">{parseShift(labelCheck.front.am, "FOH AM")}</div>
        <div className="list">
          {parseShift(labelCheck.kitchen.pm, "BOH PM")}
        </div>
        <div className="list">{parseShift(labelCheck.front.pm, "FOH PM")}</div>
      </div>
    );
  };

  const getLabelCheckCompletionRate = (shift, expectedLabelChecks) => {
    return (shift.totalLabelChecks / expectedLabelChecks) * 100;
  };

  const getWholeLabelCheck = (shift) => {
    const checkArr = shift.checks;

    function getLabelCheckParagraph(check) {
      const vArr = check.violations.concat(check.repeats);

      if (!vArr.length) return "No discrepancies found!";

      return vArr.map((v, i) => (
        <div className="sub-panel-2" key={i}>
          <span>
            {v.type}: {v.product}{" "}
          </span>
          <span>{v.corrective}</span>
        </div>
      ));
    }

    return checkArr.map((check, i) => (
      <ExpandableItem
        key={i}
        title={check.fullName}
        inner={getLabelCheckParagraph(check)}
      />
    ));
  };

  const getLabelCheckList = () => {
    return (
      <div className="space-y-1">
        <ExpandableItem
          title="FOH AM"
          inner={getWholeLabelCheck(labelCheck.front.am)}
        />
        <ExpandableItem
          title="BOH AM"
          inner={getWholeLabelCheck(labelCheck.kitchen.am)}
        />
        <ExpandableItem
          title="FOH PM"
          inner={getWholeLabelCheck(labelCheck.front.pm)}
        />
        <ExpandableItem
          title="BOH PM"
          inner={getWholeLabelCheck(labelCheck.kitchen.pm)}
        />
      </div>
    );
  };

  const getDataPanel = (labelCheck) => {
    return (
      <>
        <div className="sub-panel">
          <div className="sub-panel-2">
            <div className="shift-heading mb-2 text-lg">
              Label Check Completion Rate
            </div>
            <table className="border-collapse sub-panel border-[2px]">
              <thead>
                <tr>
                  <th className="t-cell"></th>
                  <th className="t-cell">AM</th>
                  <th className="t-cell">PM</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th className="t-cell">Front</th>
                  <td className="t-cell">
                    {getLabelCheckCompletionRate(labelCheck.front.am, 2) + "%"}
                  </td>
                  <td className="t-cell">
                    {getLabelCheckCompletionRate(labelCheck.front.pm, 2) + "%"}
                  </td>
                </tr>
                <tr>
                  <th className="t-cell">Kitchen</th>
                  <td className="t-cell">
                    {getLabelCheckCompletionRate(labelCheck.kitchen.am, 2) +
                      "%"}
                  </td>
                  <td className="t-cell">
                    {getLabelCheckCompletionRate(labelCheck.kitchen.pm, 2) +
                      "%"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </>
    );
  };

  return (
    <div
      className={`panel w-full origin-top ${
        labelCheck ? "scale-y-100" : "scale-y-0"
      }
                     transition-all duration-[0.4s]`}
    >
      {labelCheck && (
        <>
          <div className="heading mb-3 h-10">
            {labelCheck.date ? formatDateIntoHeader(labelCheck.date) : null}
          </div>
          <div className="sub-panel-container">
            <div className="sub-panel">
              <h2 className="text-xl font-bold mb-2">Results:</h2>
              {getScorePanel(labelCheck)}
            </div>
            <div className="sub-panel-container">
              <div className="flex-col">
                <h2 className="shift-heading">Data</h2>
                <div className="sub-panel-container">
                  {getDataPanel(labelCheck)}
                </div>
              </div>
            </div>
            <div className="sub-panel-container">
              <div className="sub-panel items-start">
                <h2 className="shift-heading mb-2 text-lg">Label Checks</h2>
                {getLabelCheckList()}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CheckPanel;

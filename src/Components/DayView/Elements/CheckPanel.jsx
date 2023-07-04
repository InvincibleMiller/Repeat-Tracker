import React, { useEffect, useState } from "react";
import RepeatFetcher from "../../RepeatFetcher";
import ExpandableItem from "../../ExpandableItem";

const CheckPanel = ({ day }) => {
  const [labelCheck, setLabelCheck] = useState(null);
  const [weekCache, setCache] = useState([]);
  const [weekStart, setWs] = useState(null);
  const [weekEnd, setWe] = useState(null);

  const rlDate = new Date();

  const rf = new RepeatFetcher();

  useEffect(() => {
    const effect = async () => {
      let cache = [];

      if (day !== null) {
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

      // console.clear();
      setLabelCheck(
        cache.filter(({ date }) => {
          // console.log(date.toLocaleString());
          return date.getDate() === day.getDate();
        })[0]
      );

      setCache(cache);
    };

    effect();
  }, [day]);

  const formatDateIntoHeader = (dt) => {
    // console.log(dt);

    const dayStr = dt.toString().split(" ", 3);
    const str = String().concat(...dayStr.map((s) => s + " "));

    // console.log(str);

    const str_p2 = ` (${dt.toLocaleString().split(",", 1)})`;

    return str + str_p2;
  };

  const getListItem = (finding, index, repeat = false) => {
    const str = finding.type.concat(": ", finding.product);

    return (
      <div
        key={index}
        className="relative flex items-center justify-start group"
      >
        <div className="break-normal flex min-w-0 gap-1">
          <p>{str}</p>
          {repeat && (
            <span className="text-red-600 inline-block font-semibold">x2</span>
          )}
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

    const anything = rep.length + vio.length > 0;

    return (
      <>
        <h4 className="shift-heading">
          {name}: {!anything ? (shift.checks.length > 0 ? "🏅" : "❌") : null}
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
      <div className="sub-panel-2 items-start">
        <div className="shift-heading text-lg mb-2">
          Score: {labelCheck.score}%
        </div>
        <div className="list">
          {parseShift(labelCheck.kitchen.am, "BOH AM")}
        </div>
        <div className="list">{parseShift(labelCheck.front.am, "FOH AM")}</div>
        <div className="list">
          {parseShift(labelCheck.kitchen.pm, "BOH PM")}
        </div>
        <div className="list">{parseShift(labelCheck.front.pm, "FOH PM")}</div>
        {labelCheck.rqa.length > 0 && (
          <div className="list">
            <h4 className="shift-heading">RQA:</h4>
            <div className="flex flex-col gap-1">
              {labelCheck.rqa.map((finding) => {
                return (
                  <span>
                    <span className="font-bold">* </span>
                    {finding.corrective}
                  </span>
                );
              })}
            </div>
          </div>
        )}
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
        <ExpandableItem
          title="RQA"
          inner={labelCheck.rqa.map((finding) => {
            return (
              <ExpandableItem
                title={finding.fullName}
                inner={<span>{finding.corrective}</span>}
              />
            );
          })}
        />
      </div>
    );
  };

  const getDataPanel = (labelCheck) => {
    return (
      <div className="sub-panel-2 xl:items-start xl:max-w-max">
        <div className="shift-heading">Label Check Completion Rate</div>
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
                {getLabelCheckCompletionRate(labelCheck.kitchen.am, 2) + "%"}
              </td>
              <td className="t-cell">
                {getLabelCheckCompletionRate(labelCheck.kitchen.pm, 2) + "%"}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  };

  if (!labelCheck || (day > rlDate && !labelCheck.score))
    return <div className="panel w-full">Nothing to show!</div>;

  return (
    <div
      className={`panel w-full origin-top ${
        labelCheck ? "scale-y-100" : "scale-y-0"
      }
                     transition-all duration-[0.4s]`}
    >
      <>
        <div className="heading mb-3 h-10">
          {labelCheck.date && formatDateIntoHeader(labelCheck.date)}
        </div>
        <div className="sub-panel-container gap-2">
          <div className="sub-panel xl:w-5/12 2xl:w-3/12">
            <h2 className="panel-heading">Results</h2>
            {getScorePanel(labelCheck)}
          </div>
          <div className="sub-panel-container flex-1 flex-col gap-2">
            <div className="sub-panel">
              <h2 className="panel-heading">Data</h2>
              {getDataPanel(labelCheck)}
            </div>

            <div className="sub-panel">
              <h2 className="panel-heading">Label Checks</h2>
              {getLabelCheckList()}
            </div>
          </div>
          {/* <div className="sub-panel-container">
          </div> */}
        </div>
      </>
    </div>
  );
};

export default CheckPanel;

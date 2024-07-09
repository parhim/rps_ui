import { Listbox } from "@headlessui/react";
import { useState, useCallback, useMemo } from "react";
import { useRecoilState } from "recoil";
import { useDevnetState } from "../contexts/NetworkProvider";
import { explorerAtom, customPriorityFee, settingsOpenAtom } from "../state";
import { NetworkOption, Explorers } from "../utils/types";
import { Button } from "./Button";
import { Toggle } from "./Toggle";
import { SimpleModal } from "./common";

export const SettingsDialog = () => {
  const [isOpen, setIsOpen] = useRecoilState(settingsOpenAtom);
  const [network, setNetwork, customRpc, setCustomRpc] = useDevnetState();
  const [customVal, setCustomVal] = useState(customRpc);
  const [explorer, setExplorer] = useRecoilState(explorerAtom);
  const onClose = () => setIsOpen(false);
  const onSaveCustomRpc = useCallback(async () => {
    if (customVal) {
      if (customVal.startsWith("http://") || customVal.startsWith("https://")) {
        setCustomRpc(customVal);
      } else {
        setCustomRpc("https://" + customVal);
      }
    }
  }, [customVal, setCustomRpc]);
  return (
    <SimpleModal isOpen={isOpen} onClose={onClose}>
      <div className="bg-gray-800 p-3 rounded-lg space-y-2">
        <div className="pb-2">
          <p className="font-semibold mb-2">Network</p>
          <div>
            <Toggle onChange={(i) => setNetwork(i)} selectedIndex={network}>
              <div className="font-medium">Mainnet</div>
              <div className="font-medium">Devnet</div>
              <div className="font-medium">Custom</div>
            </Toggle>
          </div>
          {network === NetworkOption.Custom && (
            <div className="flex flex-row text-xs mt-4">
              <input
                aria-multiline={true}
                value={customVal}
                onChange={(e) => setCustomVal(e.target.value)}
              />
              <Button className="ml-2" onClick={onSaveCustomRpc}>
                Save
              </Button>
            </div>
          )}
        </div>
        <hr className="border-text-placeholder opacity-50 " />
        <PriorityFeeSetting />
        <hr className="border-text-placeholder opacity-50 " />
        <div className="w-full">
          <p className="font-semibold">Explorer</p>
          <Listbox value={explorer} onChange={setExplorer}>
            <Listbox.Button
              className={`border border-text-placeholder hover:bg-gray-800 w-full text-left pl-2`}
            >
              <span>{Explorers[explorer].name}</span>
            </Listbox.Button>
            <Listbox.Options>
              {Object.values(Explorers).map(({ name }, i) => (
                <Listbox.Option
                  key={name}
                  value={i}
                  className={` hover:bg-gray-800 w-full text-left rounded-md p-2 cursor-pointer ${
                    explorer === i ? " text-primary font-semibold" : ""
                  } `}
                >
                  {name}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Listbox>
        </div>
      </div>
    </SimpleModal>
  );
};

const PriorityFeeSetting = () => {
  const [priorityFee, setPriorityFee] = useRecoilState(customPriorityFee);
  const selected = useMemo(() => {
    if (!priorityFee) return 0;
    if (priorityFee === "10000") return 1;
    if (priorityFee === "16000") return 2;
    return 3;
  }, [priorityFee]);
  return (
    <div className="w-full">
      <p className="font-semibold mb-2">Priority Fee</p>
      <Toggle
        onChange={(i) => {
          if (!i) setPriorityFee("");
          if (i === 1) setPriorityFee("10000");
          if (i === 2) setPriorityFee("16000");
          if (i === 3) setPriorityFee("7000");
        }}
        selectedIndex={selected}
      >
        <div className="font-medium">Default</div>
        <div className="font-medium">Fast</div>
        <div className="font-medium">Turbo</div>
        <div className="font-medium">Custom</div>
      </Toggle>

      {!["", "10000", "16000"].includes(priorityFee) && (
        <div className="flex flex-col space-y-1 my-2">
          <span>Microlamports</span>
          <input
            type="number"
            value={priorityFee}
            onChange={(v) => {
              if (v) {
                setPriorityFee(v.target.value);
              } else setPriorityFee("0");
            }}
          />
        </div>
      )}
    </div>
  );
};

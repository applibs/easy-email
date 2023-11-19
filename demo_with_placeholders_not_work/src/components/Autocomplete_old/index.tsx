import * as React from "react";
import { BehaviorSubject, Observable } from "rxjs";

import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import MenuItem from "@material-ui/core/MenuItem";
import {ChangeEvent, useEffect, useState} from "react";

interface Props<S> {
    getSuggestions: <S>(subject: BehaviorSubject<string>) => Observable<S[]>;
    renderSuggestion?: (suggestion: S) => Element | string;
    onSelect?: (suggestion: S) => void;
}

const subject$ = new BehaviorSubject("");

export function Autocomplete<S>(props: Props<S>) {
    const { renderSuggestion = (s: S) => s, onSelect, getSuggestions } = props;
    const [value, setValue] = useState("");
    const [suggestions, setSuggestions] = useState<S[]>([]);
    const [highlightedIdx, setHighlightedIdx] = useState(0);

    useEffect(() => {
        const subscription = getSuggestions<S>(subject$).subscribe(
            suggestions => {
                // store suggestions in state
                console.log("suggestions");
                if(value.length > 2) {
                    setSuggestions(suggestions);
                }
            },
            error => {
                // handle error here
                console.error(error);
            }
        );

        return () => subscription.unsubscribe();
    }, [value]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        console.log("handleChange");

        setValue(e.target.value);
        subject$.next(e.target.value);
    };

    const handleSelect = (idx: number) => {
        console.log("handleSelect");
        if (onSelect) {
            onSelect(suggestions[idx]);
            setSuggestions([]);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        const UP = 'ArrowUp';//38;
        const DOWN = 'ArrowDown';//40;
        const ENTER = 'Enter';
        const INITIAL_IDX = 0;

        if (e.key === DOWN) {
            e.preventDefault();
            const idx = highlightedIdx;
            const nextIdx = idx !== undefined ? idx + 1 : INITIAL_IDX;

            if (nextIdx < suggestions.length) {
                setHighlightedIdx(nextIdx);
            } else {
                setHighlightedIdx(INITIAL_IDX);
            }
        }

        if (e.key === UP) {
            e.preventDefault();
            const lastIdx = suggestions.length - 1;
            const idx = highlightedIdx;
            const prevIdx = idx !== undefined ? idx - 1 : lastIdx;

            if (prevIdx >= 0) {
                setHighlightedIdx(prevIdx);
            } else {
                setHighlightedIdx(lastIdx);
            }
        }

        if (e.key === ENTER && highlightedIdx !== undefined) {
            handleSelect(highlightedIdx);
        }
    };

    const shouldShowSuggestions = suggestions.length > 0 && value.length > 2;

    return (
        <div style={{ width: "auto" }}>
            <TextField
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                value={value}
                placeholder={t('start typing')}
            />
            {shouldShowSuggestions && (
                <Paper>
                    {suggestions.map((suggestion, idx) => (
                        <MenuItem
                            key={`suggestion-${idx}`}
                            onClick={() => handleSelect(idx)}
                            selected={highlightedIdx === idx}
                        >
                            {renderSuggestion(suggestion)}
                        </MenuItem>
                    ))}
                </Paper>
            )}
        </div>
    );
}

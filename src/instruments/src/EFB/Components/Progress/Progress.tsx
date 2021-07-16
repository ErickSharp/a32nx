import React, { useContext } from 'react';
import { ThrottleContext } from '../../Settings/ThrottleConfig/BaseThrottleConfig';

export type ProgressBarProps = {
    completed: string | number;
    displayBar?: boolean;
    completedBarBegin?: number;
    completedBarBeginValue?: string;

    completedBarEnd?: number;
    completedBarEndValue?: string;

    bgcolor?: string;
    baseBgColor?: string;
    height?: string;
    width?: string;
    borderRadius?: string;
    margin?: string;
    padding?: string;
    labelAlignment?: 'left' | 'center' | 'right' | 'outside';
    labelColor?: string;
    labelSize?: string;
    isLabelVisible?: boolean;
    vertical?: boolean
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
    bgcolor,
    completed,
    displayBar,
    completedBarEnd,
    completedBarBegin,
    completedBarBeginValue,
    baseBgColor,
    height,
    width,
    margin,
    padding,
    borderRadius,
    labelAlignment,
    labelColor,
    labelSize,
    isLabelVisible,
    vertical,
}) => {
    const getAlignment = (
        alignmentOption: ProgressBarProps['labelAlignment'],
    ) => {
        if (alignmentOption === 'left') {
            return 'flex-start';
        }
        if (alignmentOption === 'center') {
            return 'center';
        }
        if (alignmentOption === 'right') {
            return 'flex-end';
        }
        return null;
    };

    const formatBar = (percent: number) => {
        if (vertical) return `calc(${height} - ${height} * (${percent} / 100))`;
        return `calc(${width} * (${percent} / 100))`;
    };

    const alignment = getAlignment(labelAlignment);

    const containerStyles: React.CSSProperties = {
        height,
        backgroundColor: baseBgColor,
        borderRadius,
        padding,
        width,
        margin,
        transform: vertical ? 'rotateX(180deg)' : '',

    };

    const convertProgress = (completed) => (typeof completed === 'string' || completed > 100
        ? '100%'
        : `${completed}%`);

    const fillerStyles: React.CSSProperties = {
        height: vertical
            ? convertProgress(completed) : height,
        width: !vertical
            ? convertProgress(completed) : width,
        backgroundColor: bgcolor,
        transition: 'width 1s ease-in-out',
        borderRadius: 'inherit',
        display: 'flex',
        alignItems: 'center',
        justifyContent:
            labelAlignment !== 'outside' && alignment ? alignment : 'normal',
    };

    const labelStyles: React.CSSProperties = {
        padding: labelAlignment === 'outside' ? '0 0 0 5px' : '5px',
        color: labelColor,
        fontWeight: 'bold',
        fontSize: labelSize,
        display: !isLabelVisible ? 'none' : 'initial',
    };

    const outsideStyles = {
        display: labelAlignment === 'outside' ? 'flex' : 'initial',
        alignItems: labelAlignment === 'outside' ? 'center' : 'initial',
    };

    const { throttlePos } = useContext(ThrottleContext);

    const getBarStyle = () => {
        if (completedBarBeginValue && completedBarEnd) {
            const barBegin = parseFloat(completedBarBeginValue);
            const barEnd = parseFloat((completedBarEnd !== 0 ? (completedBarEnd / 50 - 1) : 0.00).toFixed(2));

            if (vertical) {
                if (throttlePos <= barEnd && throttlePos >= barBegin) {
                    return 'absolute z-10 -mt-2.5 h-1.5 bg-green-500';// horizontal progress bar with green bg
                }
                return 'absolute z-10 -mt-2.5 h-1.5 bg-gray-400'; // horizontal progress bar
            }
            if (throttlePos <= barEnd && throttlePos >= barBegin) {
                return 'absolute -mt-2.5 w-1.5 h-8 bg-green-500'; // vertical progress bar with green bg
            }
        }
        return 'absolute -mt-2.5 w-1.5 h-8 bg-gray-400'; // vertical progress bar
    };

    return (
        <div className="flex flex-row">
            {vertical && (
                <div
                    className="text-xl mr-2 text-white"
                    style={vertical
                        ? { marginTop: `${formatBar(completedBarBegin + 2 || 0)}`, width: fillerStyles.width } : { marginLeft: `${formatBar(completedBarBegin || 0)}` }}
                >
                    {completedBarBeginValue}
                </div>
            )}
            <div className={`mt-2 ${!vertical ? 'mr-2' : ''}`}>

                <div
                    className={`text-white ${displayBar ? getBarStyle() : 'hidden'}`}
                    style={vertical
                        ? { marginTop: `${formatBar(completedBarBegin || 0)}`, width: fillerStyles.width } : { marginLeft: `${formatBar(completedBarBegin || 0)}` }}
                />

                <div
                    className={`text-white ${displayBar ? getBarStyle() : 'hidden'}`}
                    style={vertical
                        ? { marginTop: `${formatBar(completedBarEnd || 0)}`, width: fillerStyles.width } : { marginLeft: `${formatBar(completedBarEnd || 0)}` }}
                />
                <div style={outsideStyles}>
                    <div style={containerStyles}>
                        <div style={fillerStyles}>
                            {labelAlignment !== 'outside' && (
                                <span style={labelStyles}>
                                    {typeof completed === 'number' ? `${completed}%` : `${completed}`}
                                </span>
                            )}
                        </div>
                    </div>
                    {labelAlignment === 'outside' && (
                        <span style={labelStyles}>
                            {typeof completed === 'number' ? `${completed}%` : `${completed}`}
                        </span>
                    )}
                </div>
            </div>
            {vertical && (
                <div
                    className="text-xl ml-2 text-white"
                    style={vertical
                        ? { marginTop: `${formatBar(completedBarEnd + 2 || 0)}`, width: fillerStyles.width } : { marginLeft: `${formatBar(completedBarEnd || 0)}` }}
                >
                    {(completedBarEnd !== 0 ? (completedBarEnd / 50 - 1) : 0.00).toFixed(2)}
                </div>
            )}
        </div>
    );
};

ProgressBar.defaultProps = {
    bgcolor: '#6a1b9a',
    height: '20px',
    width: '100%',
    borderRadius: '50px',
    labelAlignment: 'right',
    baseBgColor: '#e0e0de',
    labelColor: '#fff',
    labelSize: '15px',
    isLabelVisible: true,
    displayBar: false,
    completedBarBegin: 0,
};

import React from 'react';
import { View, Text } from 'react-native';
import { styles } from '@/styles/sleep-details-styles';
import { MetricSection, MetricRow, MetricDuo } from './SharedComponents';

const MONTHLY_DATA = { 
    avgTime: { h: 7, m: 48 }, 
    timeInBed: '8h 10m',
    efficiency: '93%',
    latency: '18분',
    avgSpo2: '96%',
    avgHrv: '58ms',
    debt: { avg: '-15m', total: '-7h 30m' } 
};

export default function MonthlyView() {
    return (
        <>
            <Text style={styles.mainValueLg}>{MONTHLY_DATA.avgTime.h}<Text style={styles.mainUnitLg}>h</Text> {MONTHLY_DATA.avgTime.m}<Text style={styles.mainUnitLg}>m</Text></Text>
            <Text style={styles.subText}>월간 평균 수면</Text>

            <MetricSection title="평균 수면 개요">
                <MetricRow label="수면 시간" value={`${MONTHLY_DATA.avgTime.h}h ${MONTHLY_DATA.avgTime.m}m`} />
                <MetricRow label="침대에서 보낸 시간" value={MONTHLY_DATA.timeInBed} />
                <MetricRow label="수면 효율" value={MONTHLY_DATA.efficiency} />
                <MetricRow label="잠드는 시간" value={MONTHLY_DATA.latency} />
                <MetricRow label="평균 혈중 산소 포화도" value={MONTHLY_DATA.avgSpo2} />
                <MetricRow label="평균 HRV" value={MONTHLY_DATA.avgHrv} />
            </MetricSection>

            <MetricSection title="수면 부채">
                <MetricDuo label1="일 평균" value1={MONTHLY_DATA.debt.avg} label2="월 누적" value2={MONTHLY_DATA.debt.total} />
            </MetricSection>
        </>
    );
}
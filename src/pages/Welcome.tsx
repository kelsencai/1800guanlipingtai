import { PageContainer } from '@ant-design/pro-components';
import { Card, Col, Row, Statistic } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts'
import { getInfoStatistics, getRiskStatistics, getStatisticsViolationUnit } from '@/services/welcom';

const Welcome: React.FC = () => {
    const cahrts1 = useRef<HTMLDivElement>(null);
    const cahrts2 = useRef<HTMLDivElement>(null);

    const [isLoading, setisLoading] = useState(true);
    const [infoStatistics, setInfoStatistics] = useState<any>({});
    const [charts1Data, setCharts1Data] = useState<any>([]);
    const [charts2Data, setCharts2Data] = useState<any>({});

    const loadStatisticsViolationUnit = async () => {
        const { result } = await getStatisticsViolationUnit();
        const data = result.map((item: any) => ({ name: item.unitName, value: item.violationCount }))
        setCharts1Data(data);
    }

    const loadRiskStatistics = async () => {
        const { result } = await getRiskStatistics();

        const data = {
            x: result.map((item: any) => item.date),
            y: result.map((item: any) => item.riskCount)

        }
        setCharts2Data(data);
    }

    const loadInfoStatistics = async () => {
        const { result } = await getInfoStatistics();
        setInfoStatistics(result);
    }

    const onResize = () => {
        const charts1 = echarts?.init(cahrts1.current);
        const charts2 = echarts?.init(cahrts2.current);
        charts1?.resize();
        charts2?.resize();
    }

    useEffect(() => {
        if (isLoading) return;
        const charts = echarts.init(cahrts1.current);
        charts.setOption({
            tooltip: {
                trigger: 'item'
            },
            legend: {
                orient: 'vertical',
                right: 0,
                align: 'left',
                top: 'middle',
                textStyle: {
                    fontSize: 12,
                },
                formatter: function (name: string) {
                    if (name.length > 12) {
                        return name.slice(0, 12) + '...';
                    } else {
                        return name
                    }
                }
            },
            series: [
                {
                    name: '合规信息',
                    type: 'pie',
                    radius: ['48%', '90%'],
                    center: ['30%', '50%'],
                    avoidLabelOverlap: false,
                    itemStyle: {
                        borderRadius: 10,
                        borderColor: '#fff',
                        borderWidth: 2
                    },
                    label: {
                        show: false,
                        position: 'center'
                    },
                    emphasis: {
                        label: {
                            show: true,
                            fontSize: 16,
                            fontWeight: 'bold'
                        }
                    },
                    labelLine: {
                        show: false
                    },
                    data: charts1Data
                }
            ],
        });
    }, [charts1Data, cahrts1.current, isLoading])

    useEffect(() => {
        if (isLoading) return;
        const charts = echarts.init(cahrts2.current);
        charts.setOption({
            tooltip: {
                trigger: 'axis',
            },
            title: {
                show: false,
            },
            toolbox: {
                show: false,
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: charts2Data.x
            },
            yAxis: {
                type: 'value',
                boundaryGap: [0, '100%']
            },
            series: [
                {
                    name: '违规次数',
                    type: 'line',
                    symbol: 'none',
                    sampling: 'lttb',
                    itemStyle: {
                        color: 'rgb(255, 70, 131)'
                    },
                    areaStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            {
                                offset: 0,
                                color: 'rgb(255, 158, 68)'
                            },
                            {
                                offset: 1,
                                color: 'rgb(255, 70, 131)'
                            }
                        ])
                    },
                    data: charts2Data.y
                }
            ],
            grid: {
                top: 12,
                bottom:24,
                left:38,
                right:18
            }
        });
    }, [charts2Data, cahrts2.current, isLoading])

    useEffect(() => {
        setisLoading(true);
        Promise.all([
            loadStatisticsViolationUnit(),
            loadRiskStatistics(),
            loadInfoStatistics()
        ]).finally(() => {
            setisLoading(false);
        })
        window.onresize = () => onResize()
    }, [])

    return (
        <PageContainer>
            <Card title="数据概览">
                <Row gutter={16}>
                    <Col span={6}>
                        <Statistic title="案例总计" value={infoStatistics?.allCaseCount} suffix="例" loading={isLoading} />
                    </Col>
                    <Col span={6}>
                        <Statistic title="制度总计" value={infoStatistics?.allInfoCount} suffix="个" loading={isLoading} />
                    </Col>
                    <Col span={6}>
                        <Statistic title="违规总数" value={infoStatistics?.allViolationCount} suffix="次" loading={isLoading} />
                    </Col>
                    <Col span={6}>
                        <Statistic title="风险总数" value={infoStatistics?.allRiskCount} suffix="个" loading={isLoading} />
                    </Col>
                </Row>
            </Card>
            <Row gutter={16} style={{ marginTop: 16 }}>
                <Col span={12}>
                    <Card title="合规信息库">
                        <div ref={cahrts1} style={{ width: '100%', height: 260 }}></div>
                    </Card>
                </Col>
                <Col span={12}>
                    <Card title="违规数据">
                        <div ref={cahrts2} style={{ width: '100%', height: 260 }}></div>
                    </Card>
                </Col>
            </Row>
        </PageContainer>
    );
};

export default Welcome;

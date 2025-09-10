package metrics

import (
	"time"

	"github.com/prometheus/client_golang/prometheus"
	"github.com/shirou/gopsutil/v3/cpu"
	"github.com/shirou/gopsutil/v3/mem"
)

var (
	CPUUsage = prometheus.NewGauge(prometheus.GaugeOpts{
		Name: "cpu_usage_percent",
		Help: "Current CPU usage percentage",
	})

	MemoryUsage = prometheus.NewGauge(prometheus.GaugeOpts{
		Name: "memory_usage_bytes",
		Help: "Current memory usage in bytes",
	})

	MemoryTotal = prometheus.NewGauge(prometheus.GaugeOpts{
		Name: "memory_total_bytes",
		Help: "Total memory available in bytes",
	})

	TotalRequests = prometheus.NewCounter(prometheus.CounterOpts{
		Name: "http_requests_total",
		Help: "Total number of HTTP requests",
	})

	RequestDuration = prometheus.NewHistogram(prometheus.HistogramOpts{
		Name:    "http_request_duration_seconds",
		Help:    "Duration of HTTP requests in seconds",
		Buckets: []float64{0.1, 0.3, 0.5, 1, 2, 5},
	})
)

func init() {
	prometheus.MustRegister(CPUUsage)
	prometheus.MustRegister(MemoryUsage)
	prometheus.MustRegister(MemoryTotal)
	prometheus.MustRegister(TotalRequests)
	prometheus.MustRegister(RequestDuration)
}

func CollectSystemMetrics() {
	ticker := time.NewTicker(5 * time.Second)
	defer ticker.Stop()

	for range ticker.C {
		collectCPUMetrics()
		collectMemoryMetrics()
	}
}

func collectCPUMetrics() {
	cpuPercent, err := cpu.Percent(time.Second, false)
	if err == nil && len(cpuPercent) > 0 {
		CPUUsage.Set(cpuPercent[0])
	}
}

func collectMemoryMetrics() {
	memInfo, err := mem.VirtualMemory()
	if err == nil {
		MemoryUsage.Set(float64(memInfo.Used))
		MemoryTotal.Set(float64(memInfo.Total))
	}
}

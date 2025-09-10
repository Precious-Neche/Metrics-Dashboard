package main

import (
	"fmt"
	"log"
	"net/http"
	"time"
	
	"github.com/prometheus/client_golang/prometheus/promhttp"
	"metric-apps/metrics"
)

// Add CORS middleware function
func enableCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Allow requests from any origin
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		
		// Handle preflight OPTIONS requests
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}
		
		next.ServeHTTP(w, r)
	})
}

func mainHandler(w http.ResponseWriter, r *http.Request) {
	start := time.Now()
	metrics.TotalRequests.Inc()

	// Add CORS headers to this endpoint too
	w.Header().Set("Access-Control-Allow-Origin", "*")
	
	// Simulate some work
	time.Sleep(time.Duration(100+time.Now().UnixNano()%400) * time.Millisecond)

	w.Header().Set("Content-Type", "application/json")
	fmt.Fprintf(w, `{"status": "ok", "message": "System metrics collector"}`)

	duration := time.Since(start).Seconds()
	metrics.RequestDuration.Observe(duration)
}

func healthHandler(w http.ResponseWriter, r *http.Request) {
	// Add CORS headers to this endpoint too
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Content-Type", "application/json")
	fmt.Fprintf(w, `{"status": "healthy", "timestamp": "%s"}`, time.Now().Format(time.RFC3339))
}

func main() {
	// Start metric collection in background
	go metrics.CollectSystemMetrics()

	// Set up HTTP server with CORS enabled for all handlers
	http.HandleFunc("/", mainHandler)
	http.HandleFunc("/health", healthHandler)
	http.Handle("/metrics", enableCORS(promhttp.Handler())) // Wrap metrics endpoint with CORS

	port := ":8080"
	log.Printf("Starting server on port %s", port)
	log.Printf("Metrics available at http://localhost%s/metrics", port)
	log.Fatal(http.ListenAndServe(port, nil))
}
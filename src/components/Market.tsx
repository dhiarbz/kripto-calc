"use client";

const Market = () => {
    return (
        <section id="market" className="py-16 bg-background">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              {/* Header */}
                <div className="text-center mb-16 space-y-4">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
                    Market Overview
                </h2>
                <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
                    Professional-grade calculators designed for serious crypto traders and investors. 
                    Make informed decisions with accurate calculations and real-time data.
                </p>
                </div>
            </div>
        </section>
    );
};

export default Market;
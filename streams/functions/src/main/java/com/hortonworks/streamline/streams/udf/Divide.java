package com.hortonworks.streamline.streams.udf;

import com.hortonworks.streamline.streams.rule.UDF2;

public class Divide implements UDF2<Double, Long, Long> {
    @Override
    public Double evaluate(Long input, Long divisor) {
        return (input / (double) divisor);
    }
}

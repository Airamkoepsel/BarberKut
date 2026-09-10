package com.barberkut.backend.util;

import java.text.Normalizer;
import java.util.regex.Pattern;

public final class Slugify {

    private static final Pattern NON_ALNUM = Pattern.compile("[^a-z0-9]+");
    private static final Pattern EDGE_HYPHENS = Pattern.compile("(^-+)|(-+$)");

    private Slugify() {
    }

    public static String slugify(String input) {
        String normalized = Normalizer.normalize(input, Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "");
        String slug = NON_ALNUM.matcher(normalized.toLowerCase()).replaceAll("-");
        return EDGE_HYPHENS.matcher(slug).replaceAll("");
    }
}

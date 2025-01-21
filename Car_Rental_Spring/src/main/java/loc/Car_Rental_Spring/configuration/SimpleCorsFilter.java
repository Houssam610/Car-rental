package loc.Car_Rental_Spring.configuration;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class SimpleCorsFilter implements Filter {

    @Override
    public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain) throws IOException, ServletException {
        HttpServletResponse response = (HttpServletResponse) res;
        HttpServletRequest request = (HttpServletRequest) req;

        // Autoriser l'origine spécifique (par exemple, http://localhost:4200)
        String originHeader = request.getHeader("origin");
        response.setHeader("Access-Control-Allow-Origin", originHeader);

        // Autoriser les méthodes HTTP spécifiques
        response.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT, OPTIONS, DELETE");

        // Autoriser les en-têtes spécifiques
        response.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type");

        // Autoriser les cookies et les en-têtes d'authentification
        response.setHeader("Access-Control-Allow-Credentials", "true");

        // Définir la durée de vie du preflight request
        response.setHeader("Access-Control-Max-Age", "3600");

        // Gérer les requêtes OPTIONS (preflight)
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            response.setStatus(HttpServletResponse.SC_OK);
        } else {
            chain.doFilter(req, res);
        }
    }

    @Override
    public void init(FilterConfig filterConfig) {
        // Initialisation du filtre (si nécessaire)
    }

    @Override
    public void destroy() {
        // Nettoyage du filtre (si nécessaire)
    }
}
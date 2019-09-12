FROM navikt/fss-frontend
COPY --from=builder /source/build /app
